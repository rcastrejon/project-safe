pipeline {
    // agent {
    //     docker { image 'oven/bun' }
    // }

    agent any

    parameters {
        string(name: 'DEPLOY_PIPELINE', defaultValue: 'safe_api_deploy')
    }

    environment {
        CONTAINER_NAME     = "safe_api"
    }

    stages {
        // stage('Install Dependencies') {
        //     steps {
        //         echo 'Installing dependencies...'
        //         sh 'bun install'
        //     }
        // }
        // stage('Build') {
        //     steps {
        //         echo 'Building...'
        //         sh 'bun run build:exec'
        //     }
        // }

        stage('Build') {
            steps {
                echo 'Building docker image...'
                sh "docker build -t ${CONTAINER_NAME}_image:${BUILD_NUMBER} ."
            }
        }
    }

    post {
        success {
            build job: "${params.DEPLOY_PIPELINE}", parameters: [string(name: "IMAGE_TAG", value: "${CONTAINER_NAME}_image:${BUILD_NUMBER}")], propagate: true, wait: true
        }
    }
}
