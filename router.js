const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
sharp.cache(false);

const router = express.Router();
const upload = require('./uploadMiddleware');
const Resize = require('./Resize');
const imgFuncs = require('./imgFunctions');

router.get('/', async function (req, res) {
  await res.render('index');
});

router.post('/post', upload.single('image'), async (req, res) => {
    const imagePath = path.join(__dirname, '/public/images');
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
      return res.status(401).json({error: 'Please provide an image'});
    }

    const filename = await fileUpload.save(req.file.buffer);

    //console.log( new Float32Array(req.file.buffer));

    sharp("public/images/"+filename)   
      .raw()
         .toBuffer((err, data, info) => {
            var originalImg = new Float32Array(data);

            console.log(info);
            console.log(originalImg);

            imgFuncs.grayscale(originalImg);

            console.log(originalImg.filter((n) => n < 255 && n > 1));
            const simplified = imgFuncs.reduce_rgba_to_one_chanel(originalImg);

            const dataOtsu = imgFuncs.otsusThreshold(simplified);
            imgFuncs.binarization(originalImg, dataOtsu);
            
            const finalResult = new Uint8ClampedArray(originalImg);
            console.log(dataOtsu);
            console.log(simplified);

            const image = sharp(finalResult, {
              raw: {
                    width: 100,
                    height: 100,
                    channels: 3
                  }
            });
            image.toFile('public/images/finalResult.png');
          });

    return res.status(200).json({ img : 'test' });
});

module.exports = router;