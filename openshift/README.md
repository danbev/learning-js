## Openshift Node.js

### Login
Access 
[openshift sandbox console](https://console-openshift-console.apps.sandbox.x8i5.p1.openshiftapps.com)
and select the user account drop down and "Copy login command" to get the
command and access token to use below:
```console
$ oc login --token=<token> --server=https://api.sandbox.x8i5.p1.openshiftapps.com:6443
Logged into "https://api.sandbox.x8i5.p1.openshiftapps.com:6443" as "dbevenius" using the token provided.

You have one project on this server: "dbevenius-dev
```
```console
$ oc projects
You have one project on this server: "dbevenius-dev"
```
### Create an application using a container image
First we need to push the image we want to use to publicly availabe image
repository, like docker.io, quay.io, or ghrc.io. 
First login to quay.io which is the repository we will be using:
```console
$ ./quay-login.sh 
Login Succeeded!
```
First tag the image we want to push:
```console
$ podman tag docker.io/library/paketo-example-app quay.io/dbevenius/paketo-example-app
```
Then we can push the tagged image:
```console
$ podman push quay.io/dbevenius/paketo-example-app
Getting image source signatures
Copying blob 2835014c12c3 done  
Copying blob 634bceb1f7b3 done  
Copying blob 09ad7f3d6d01 done  
Copying blob ff3102d3cb7d done  
Copying blob 4a641e21953d done  
Copying blob 1b56809dd980 done  
Copying blob 54d744abba5b done  
Copying blob 074483e573bf done  
Copying blob 5e030f851ba8 done  
Copying blob aafd65ba2bd9 done  
Copying blob 9497805c7bd5 done  
Copying blob 86aa229f33a7 done  
Copying blob 83d85471d9f8 done  
Copying config 598ba9faa7 done  
Writing manifest to image destination
Storing signatures
```
We can verify that this has been pushed https://quay.io/user/dbevenius?tab=repos.
Don't forget to make this repository public or openshift will not be able to
pull it. This can be done by accessing
[settings](https://quay.io/repository/dbevenius/paketo-example-app?tab=settings)
in quay.io.

With that in place we should be able to create an new application in Openshift
using `oc new-app`:
```console
$ oc new-app quay.io/dbevenius/paketo-example-app:latest
--> Found container image 598ba9f (42 years old) from quay.io for "quay.io/dbevenius/paketo-example-app:latest"

    Tags: builder, paketo

    * An image stream tag will be created as "paketo-example-app:latest" that will track this image

--> Creating resources ...
    imagestream.image.openshift.io "paketo-example-app" created
    deployment.apps "paketo-example-app" created
--> Success
    Run 'oc status' to view your app.
```
