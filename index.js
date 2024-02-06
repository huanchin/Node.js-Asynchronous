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
  return "2: Ready"
}

getDog();

/************************** test 1: get the return from Promise *******************************/

console.log("1: Start to get image")
const x = getDog();
console.log("3: End")
// OUTPUT:
// 1: Start to get image
// Promise { <pending> }
// 3: End
// Breed: retriever
// https://images.dog.ceo/breeds/retriever-golden/n02099601_6099.jpg
// Random dog image saved the file!
/************************** test 2: get the return from Promise *******************************/

console.log('1: Start to get image');
getDog()
  .then((x) => {
    console.log(x);
    console.log('3: End');
  })
  .catch((err) => console.log(err));
// OUTPUT
// 1: Start to get image
// Breed: retriever
// https://images.dog.ceo/breeds/retriever-flatcoated/n02099267_3768.jpg
// Random dog image saved the file!
// 2: Ready
// 3: End
/************************** test 2: get the return from Promise *******************************/
(async () => {
  try {
    console.log('1: Start to get image');
    const x = await getDog();
    console.log(x);
    console.log('3: End');
  } catch (err) {
    console.log(err);
  }
})();
