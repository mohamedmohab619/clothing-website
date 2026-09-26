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
            }
        }
    }
}
