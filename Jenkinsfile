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
        killall -9 middleman
        sh 'npm run test'
      }
    }
    stage('Test') {
          steps {
            sh 'killall -9 node'
            sh 'npm start'
          }
        }
  }
}