pipeline {
  agent any
  stages {
    stage('Install'){
      steps {
        sudo npm install
      }
    }
    stage('Test') {
      steps {
        npm run test
      }
    }
  }
}