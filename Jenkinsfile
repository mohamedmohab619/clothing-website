pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Image') {
            steps {
                sh 'docker build -t aven-store:latest .'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker rm -f aven-app || true'
                sh 'docker run -d --name aven-app -p 3000:3000 aven-store:latest'

                withCredentials([
                  string(credentialsId: 'NODE_ENV', variable: 'NODE_ENV'),
                  string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL'),
                  string(credentialsId: 'BETTER_AUTH_SECRET', variable: 'BETTER_AUTH_SECRET'),
                  string(credentialsId: 'BETTER_AUTH_URL', variable: 'BETTER_AUTH_URL')
                ]) {

                  sh 'docker rm -f aven-app || true'
                  sh '''
                      docker run -d --name aven-app -p 3000:3000  \
                        -e NODE_ENV=$NODE_ENV \
                        -e DATABASE_URL=$DATABASE_URL \
                        -e BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET \
                        -e BETTER_AUTH_URL=$BETTER_AUTH_URL \
                        aven-store:latest
                  '''
                }
            }
        }
    }
}
