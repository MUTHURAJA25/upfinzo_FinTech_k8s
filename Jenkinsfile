pipeline {

    agent any

    environment {
        DOCKER_USER = credentials('DOCKER_USER')
        DOCKER_PASS = credentials('DOCKER_PASS')
        SONAR_TOKEN = credentials('SONAR_TOKEN')
    }

    parameters {
        booleanParam(
            name: 'DESTROY',
            defaultValue: false,
            description: 'Destroy Terraform Infrastructure'
        )
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Terraform Init') {
            steps {
                dir('infra') {
                    sh 'terraform init'
                }
            }
        }

        

        stage('Terraform Plan') {
            when {
                expression { !params.DESTROY }
            }
            steps {
                dir('infra') {
                    sh 'terraform plan -out=tfplan'
                }
            }
        }

        stage('Unit Test') {
            steps {
                dir('fintech-app/frontend') {
                    sh '''
                        if [ -f package.json ]; then
                            npm install
                            npm test || true
                        fi
                    '''
                }
            }
        }

        stage('SonarQube Scan') {
    steps {
        script {
            def scannerHome = tool 'SonarScanner'

            withSonarQubeEnv('SonarQube') {
                dir('fintech-app/frontend') {
                    sh """
                    ${scannerHome}/bin/sonar-scanner \
                    -Dsonar.projectKey=fintech-app \
                    -Dsonar.projectName=fintech-app \
                    -Dsonar.sources=.
                    """
                }
            }
        }
    }
}

        stage('Terraform Apply') {
            when {
                expression { !params.DESTROY }
            }
            steps {
                dir('infra') {
                    sh 'terraform apply -auto-approve tfplan'
                }
            }
        }

        stage('Docker Build') {
    steps {
        script {
            def services = [
                'user-service',
                'kyc-service',
                'merchant-service',
                'payin-service',
                'payout-service',
                'transaction-service',
                'notification-service',
                'fraud-service'
            ]

            for (service in services) {
                dir("fintech-app/microservices/${service}") {
                    sh "docker build -t ${DOCKER_USER}/${service}:v1 ."
                }
            }
        }
    }
}

        stage('Trivy Scan') {
    steps {
        script {
            def services = [
                'user-service',
                'kyc-service',
                'merchant-service',
                'payin-service',
                'payout-service',
                'transaction-service',
                'notification-service',
                'fraud-service'
            ]

            for (service in services) {
                sh "trivy image --severity HIGH,CRITICAL ${DOCKER_USER}/${service}:v1"
            }
        }
    }
}

        stage('Docker Push') {
    steps {
        sh '''
        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
        '''

        script {
            def services = [
                'user-service',
                'kyc-service',
                'merchant-service',
                'payin-service',
                'payout-service',
                'transaction-service',
                'notification-service',
                'fraud-service'
            ]

            for (service in services) {
                sh "docker push ${DOCKER_USER}/${service}:v1"
            }
        }
    }
}

        stage('Deploy Kubernetes') {
    when {
        expression { !params.DESTROY }
    }
    steps {
        sh '''
        kubectl apply -f kubernetes/
        kubectl apply -f services/
        '''
    }
}

        stage('Terraform Destroy') {
            when {
                expression { params.DESTROY }
            }
            steps {
                dir('infra') {
                    sh 'terraform destroy -auto-approve'
                }
            }
        }
    }
}

