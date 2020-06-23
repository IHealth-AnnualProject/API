pipeline {
  agent any
  options{
            disableConcurrentBuilds()
         }
  stages {
    stage('Install'){
      steps {
       sh 'killall -9 node || true'
       systemctl stop betsbi.service
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
            sh 'JENKINS_NODE_COOKIE=dontKillMe systemctl start betsbi.service'
          }
        }
  }
}