pipeline {
    agent any

    parameters {
        string(name: 'IMAGE_TAG')
    }

    environment {
        CONTAINER_NAME     = 'safe_api'

        DATABASE_URL       = credentials('jenkins-database-url')
        UPLOADTHING_SECRET = credentials('jenkins-uploadthing-secret')
        UPLOADTHING_APP_ID = credentials('jenkins-uploadthing-app-id')
        LOG_LEVEL          = "debug"
        LOG_OUTPUT_PATH    = "/home/bun/app/out.log"
    }
    
    stages {
        stage('Deploy') {
            steps {
                sh "docker stop ${CONTAINER_NAME} > /dev/null 2>&1 || true"
                sh """
                docker run --rm --name ${CONTAINER_NAME} \
                 -p 3000:3000 \
                 -e LOG_OUTPUT_PATH='${LOG_OUTPUT_PATH}' \
                 -e LOG_LEVEL='${LOG_LEVEL}' \
                 -e DATABASE_URL='${DATABASE_URL}' \
                 -e UPLOADTHING_SECRET='${UPLOADTHING_SECRET}' \
                 -e UPLOADTHING_APP_ID='${UPLOADTHING_APP_ID}' \
                 -d ${params.IMAGE_TAG}
                """
            }
        }
    }
}
