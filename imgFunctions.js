module.exports = {
    otsusThreshold: function (img) {
        
        var n_bins = 0.1;

        var total_weight = img.length;

        var least_variance = -1;
        var least_variance_threshold = -1;

        var min_element = Math.min(...img) + n_bins;
        var max_element = Math.max(...img) - n_bins;

        var color_thresholds = [];

        for (let i = min_element; i <= max_element; i+= n_bins) {
            color_thresholds.push(i);        
        }
        
        for (const color_threshold of color_thresholds) {
            
            var bg_pixels = [];
            var fr_pixels = [];

            bg_pixels = img.filter((number) => { return number < color_threshold});

            var weight_bg = bg_pixels.length / total_weight;

            //calculate mean of background pixels
            var mean_bg = 0;
            for (const bg_pixel of bg_pixels) {
                mean_bg += bg_pixel;
            }
            mean_bg = mean_bg / bg_pixels.length;

            //calculate variance of backdround pixels
            var variance_bg = 0;
            for (const bg_pixel of bg_pixels) {
                variance_bg += Math.pow(bg_pixel - mean_bg, 2)
            }

            variance_bg += variance_bg / bg_pixels.length;

            fr_pixels = img.filter((number) => { return number >= color_threshold});
            var weight_fr = fr_pixels.length / total_weight;

            //calculate mean of foreground pixels
            var mean_fr = 0;

            for (const fr_pixel of fr_pixels) {
                mean_fr += fr_pixel;
            }
            mean_fr = mean_fr / fr_pixels.length;

            //calculate variance of foreground pixels
            var variance_fr = 0;
            for (const fr_pixel of fr_pixels) {
                variance_fr += Math.pow(fr_pixel - mean_fr, 2);
            }
            variance_fr += variance_fr / bg_pixels.length;

            var class_variance = (weight_fr * variance_fr) + (weight_bg * variance_bg);

            if (least_variance == -1 || least_variance > class_variance) {
                least_variance = class_variance;
                least_variance_threshold = color_threshold;
            }
        }

        return least_variance_threshold;
    },

    grayscale: function (img) {

        for (let i = 0; i < img.length; i+=3) {

            let brightness = (0.2125 * img[i]) + (0.7154 * img[i+1])  + (0.0721 * img[i+2]); 
            
            img[i] = brightness / 255.0;
            img[i+1] = brightness / 255.0;
            img[i+2] = brightness / 255.0;
        }
    },

    reduce_rgba_to_one_chanel: function (img){
        
        var delta = 3;
        var simplified_image = [];

        for (let i = 0; i < img.length; i+=delta) {
            simplified_image.push(img[i]);
        }

        return simplified_image;
    },

    binarization: function(img, threshold) {

        for (let i = 0; i < img.length; i+=3) {
            
            if(img[i] < threshold) {
                
                img[i] = 255;
                img[i+1] = 255;
                img[i+2] = 255;
            }else {

                img[i] = 0;
                img[i+1] = 0;
                img[i+2] = 0;
            }
        }
    },

    teste: function(img){
        console.log(img[0]=1);
    }

};