DEL .\docker\build /s /f /q
xcopy build\*.* docker\build\ /E
DEL .\docker\build\*.map /s /f /q
docker build ./docker -t pets-admin-client --build-arg ARCH=amd64
docker tag pets-admin-client maiznpetr/pets-admin-client:v1.0.08.1-amd64
docker push maiznpetr/pets-admin-client:v1.0.08.1-amd64
DEL .\docker\build /s /f /q