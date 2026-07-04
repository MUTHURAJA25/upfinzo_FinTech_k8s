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
            when {
                expression { !params.DESTROY }
            }
            steps {
                dir('infra') {
                    sh 'terraform init'
                }
            }
        }

        stage('Terraform Validate') {
            when {
                expression { !params.DESTROY }
            }
            steps {
                dir('infra') {
                    sh 'terraform validate'
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
                            -t ${DOCKER_USER}/${service}:v1 \
                            .
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

        stage('Deploy Kubernetes') {
            when {
                expression { !params.DESTROY }
            }
            steps {

                sh '''
                kubectl apply -f kubernetes/
                kubectl apply -f services/
                '''

                sh '''
                kubectl rollout restart deployment user-service
                kubectl rollout restart deployment kyc-service
                kubectl rollout restart deployment merchant-service
                kubectl rollout restart deployment payin-service
                kubectl rollout restart deployment payout-service
                kubectl rollout restart deployment transaction-service
                kubectl rollout restart deployment notification-service
                kubectl rollout restart deployment fraud-service
                '''

            }
        }

        stage('Verify Deployment') {
            when {
                expression { !params.DESTROY }
            }
            steps {

                sh 'kubectl get pods'
                sh 'kubectl get deployments'
                sh 'kubectl get svc'

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