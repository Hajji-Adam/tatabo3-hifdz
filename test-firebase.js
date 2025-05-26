const { bucket } = require('./config/firebase');

async function testUpload() {
  const fileName = 'test/test.txt';
  await bucket.upload('README.md', {
    destination: fileName,
  });

  console.log('✅ Uploaded to Firebase Storage:', fileName);
}

testUpload();