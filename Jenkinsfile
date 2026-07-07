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

        stage('Unit Test') {
            when {
                expression { !params.DESTROY }
            }
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
            when {
                expression { !params.DESTROY }
            }
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {
                        dir('fintech-app/frontend') {
                            sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=fintech-app \
                            -Dsonar.projectName=fintech-app \
                            -Dsonar.sources=. \
                            -Dsonar.token=${SONAR_TOKEN}
                            """
                        }
                    }
                }
            }
        }

        stage('Docker Build') {
            when {
                expression { !params.DESTROY }
            }
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
                            sh """
                            docker build \
                            -t ${DOCKER_USER}/${service}:v1 .
                            """
                        }
                    }
                }
            }
        }

        stage('Trivy Scan') {
            when {
                expression { !params.DESTROY }
            }
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
                        sh """
                        trivy image \
                        --severity HIGH,CRITICAL \
                        ${DOCKER_USER}/${service}:v1
                        """
                    }
                }
            }
        }

        stage('Docker Push') {
            when {
                expression { !params.DESTROY }
            }
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

        stage('Deploy using Helm') {
    when {
        expression { !params.DESTROY }
    }
    steps {
        sh '''
        /usr/local/bin/helm upgrade --install fintech fintech-app/helm -n fintech
        '''
    }
}

        stage('Verify Deployment') {
            when {
                expression { !params.DESTROY }
            }
            steps {
                sh 'kubectl get pods -n fintech'
                sh 'kubectl get deployments -n fintech'
                sh 'kubectl get svc -n fintech'
                sh 'kubectl get ingress -n fintech || true'
                sh 'kubectl get hpa -n fintech || true'
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

    post {

        always {
            cleanWs()
        }

        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check the logs.'
        }

    }

}