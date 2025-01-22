#Run app locally
ng serve --port 4300
#ng serve #runs at 4200

#Build for production

#ng build --configuration production

# Development with SSR
#npm run dev:ssr

# Production build
#npm run build:ssr

# Serve SSR app
#npm run serve:ssr:nmbs-rag-angular-ui

#Docker - ECR login and create repository
#aws ecr get-login-password --region us-east-1 --debug | docker login --username AWS --password-stdin aws-account-id.dkr.ecr.us-east-1.amazonaws.com
#aws ecr create-repository --repository-name nmbs-rag-angular-ui --region us-east-1

#Docker Build Commands
#docker pull nginx:1.27-alpine
#docker pull node:22-alpine 
#sudo docker build -t nmbs-rag-angular-ui .
#docker build -t nmbs-rag-angular-ui . --progress=plain
#docker run -p 8080:80 --name nmbs-ai-ui -d nmbs-rag-angular-ui:latest 
#docker run -p 4000:4000 --name nmbs-ai-ui -d nmbs-rag-angular-ui

#push image
#docker tag nmbs-rag-angular-ui aws-account-id.dkr.ecr.us-east-1.amazonaws.com/nmbs-rag-angular-ui:v0.1
#docker push aws-account-id.dkr.ecr.us-east-1.amazonaws.com/nmbs-rag-angular-ui:v0.1



