pipeline {
  agent any
  stages {
    stage('Install'){
      steps {
       sh 'killall -9 node || true'
       sleep(time:3,unit:"SECONDS")
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
            BUILD_ID=dontKillMe nohup npm start &
          }
        }
  }
}