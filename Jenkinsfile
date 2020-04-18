pipeline {
  agent any
  stages {
    stage('Install'){
      steps {
       sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'npm run test'
      }
    }
    stage('Deploy') {
          steps {
            sh 'killall -9 node || true'
            sh 'npm start &'
          }
        }
  }
}