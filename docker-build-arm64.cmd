DEL .\docker\build /s /f /q
xcopy build\*.* docker\build\ /E
DEL .\docker\build\*.map /s /f /q
docker build ./docker -t pets-admin-client --build-arg ARCH=arm64
docker tag pets-admin-client maiznpetr/pets-admin-client:v1.0.07.4-arm64v8
docker push maiznpetr/pets-admin-client:v1.0.07.4-arm64v8
DEL .\docker\build /s /f /q