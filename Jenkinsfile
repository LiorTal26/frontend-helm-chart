pipeline {
    
  agent {
    kubernetes {
      cloud 'kubernetes-lior-local'
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: jenkins-agent
spec:
  serviceAccountName: jenkins
  containers:
    - name: dind
      image: docker:20.10-dind
      securityContext:
        privileged: true
      env:
        - name: DOCKER_TLS_CERTDIR
          value: ""
      args:
        - --host=tcp://0.0.0.0:2375
        - --storage-driver=overlay2

    - name: docker
      image: docker:20.10
      command:
        - cat
      tty: true
      env:
        - name: DOCKER_HOST
          value: tcp://localhost:2375

    - name: aws-cli
      image: amazon/aws-cli:2.11.0
      command:
        - cat
      tty: true

    - name: helm
      image: alpine/helm:3.10.0
      command:
        - cat
      tty: true
"""
    }
  }

  environment {
    AWS_REGION    = 'il-central-1'
    ECR_REGISTRY  = '314525640319.dkr.ecr.il-central-1.amazonaws.com'
    ECR_REPO      = 'lior/helm/frontend'
    IMAGE_TAG     = "${env.BUILD_NUMBER}"
    IMAGE_NAME    = "${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}"
    CHART_DIR     = 'lior-nginx'
    RELEASE_NAME  = 'lior-nginx'
    NAMESPACE     = 'web1'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Authenticate to ECR') {
      steps {
        container('aws-cli') {
          withCredentials([[
            $class: 'AmazonWebServicesCredentialsBinding',
            credentialsId: 'imtech'
          ]]) {
            script {
              env.ECR_PASSWORD = sh(
                script: "aws --region ${AWS_REGION} ecr get-login-password",
                returnStdout: true
              ).trim()
            }
          }
        }
      }
    }

    stage('Build & Push Docker Image') {
      steps {
        container('docker') {
          sh """
            echo 'Waiting for Docker daemon…'
            until docker info > /dev/null 2>&1; do sleep 3; done

            echo '${ECR_PASSWORD}' | docker login -u AWS --password-stdin ${ECR_REGISTRY}
            docker build -t ${IMAGE_NAME} ./frontend
            docker push ${IMAGE_NAME}
          """
        }
      }
    }

    stage('Helm Lint & Package') {
      steps {
        container('helm') {
          sh """
            helm lint ${CHART_DIR}
          """
        }
      }
    }

    stage('Deploy with Helm') {
      steps {
        container('helm') {
          sh """
            helm upgrade --install ${RELEASE_NAME} ${CHART_DIR} \
              --namespace ${NAMESPACE} \
              --set image.repository=${ECR_REGISTRY}/${ECR_REPO} \
              --set image.tag=${IMAGE_TAG} 
          """
        }
      }
    }
  }

  post {
    success {
      echo "Deployment successful: ${IMAGE_NAME} deployed to ${NAMESPACE} namespace."
    }
    failure {
      echo "Deployment failed. Please check the logs for details."
    }
    
    always {
      deleteDir()
    }
  }
}
