# AWS Large File Upload Example

This is a simple example showing you how to do multi-part file uploads in JavaScript (React/Meteor.js/Node.js) for AWS S3, with their modern aws-sdk.

## Running

1. Create a settings.json with the following content

```json
{
	"AWSAccessKeyId": "Your AWS Access Key Id",
	"AWSSecretAccessKey": "Secret Key Id"
}
```

2. Change your AWS details in `imports/api/aws/methods.ts`
3. Make sure your permissions are open on AWS (or you may get an Access Denied error)
4. Run `meteor --settings settings.json` to start the server

## Tutorial

You can watch the YouTube tutorial right here: [YouTube](https://youtu.be/SQWJ_goOxGs)

---

If you want to support the work I do, please consider donating to me on one of these platforms:

[<img alt="liberapay" src="https://img.shields.io/badge/-LiberaPay-EBC018?style=flat-square&logo=liberapay&logoColor=white" />](https://liberapay.com/stevesteacher/)
[<img alt="kofi" src="https://img.shields.io/badge/-Kofi-7648BB?style=flat-square&logo=ko-fi&logoColor=white" />](https://ko-fi.com/stevesteacher)
[<img alt="patreon" src="https://img.shields.io/badge/-Patreon-F43F4B?style=flat-square&logo=patreon&logoColor=white" />](https://www.patreon.com/Stevesteacher)
[<img alt="paypal" src="https://img.shields.io/badge/-PayPal-0c1a55?style=flat-square&logo=paypal&logoColor=white" />](https://www.paypal.com/donate/?hosted_button_id=P9V2M4Q6WYHR8)
