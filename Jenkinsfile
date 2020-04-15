pipeline {
  agent any
  stages {
    stage('Install'){
      steps {
       sh 'sudo npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'npm run test'
      }
    }
  }
}