const fs = require('fs');
const superagent = require('superagent');

/************************** solution 1 *******************************/

//callback hell
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`breed: ${data}`);
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.log(err.message);
//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         if (err) return console.log(err.message);
//         console.log('Random dog image saved the file');
//       });
//     });
// });

/************************** solution 2: Promises *******************************/

// promisify read file and write file functions (make them so that they return promises)
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not found the file! Read file failed...');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Write file failed!');
      resolve('Random dog image saved the file');
    });
  });
};

// Promises
readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro('dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('Random dog image saved the file!');
  })
  .catch((err) => {
    console.log(err);
  });

/************************** solution 3: Async/ Await *******************************/

async function getDog() {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`,
    );
    console.log(res.body.message);
    await writeFilePro(`${__dirname}/dog-img.txt`, res.body.message);
    console.log('Random dog image saved the file!');
  } catch (err) {
    console.log(err.message);
    throw err;
  }
}

getDog();
