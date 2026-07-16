import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'jbzy4h0h',
  api_key: '794676683839476',
  api_secret: 'YX61bdk8tVz1Hlk_zQNoqRgQpk4'
});

async function run() {
  try {
    console.log("Uploading image to Cloudinary...");
    // 2. Upload an image
    const uploadResult = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg", 
      { public_id: "test_sample" }
    );
    
    console.log("Upload Success!");
    console.log("Secure URL:", uploadResult.secure_url);
    console.log("Public ID:", uploadResult.public_id);

    // 3. Get image details
    console.log("\n--- Image Details ---");
    console.log("Width:", uploadResult.width);
    console.log("Height:", uploadResult.height);
    console.log("Format:", uploadResult.format);
    console.log("File Size (bytes):", uploadResult.bytes);

    // 4. Transform the image
    // f_auto: automatic format selection to deliver the best format based on the browser
    // q_auto: automatic quality to deliver the best visual quality with smallest file size
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: "auto",
      quality: "auto"
    });

    console.log("\nDone! Click link below to see optimized version of the image. Check the size and the format.");
    console.log(transformedUrl);

  } catch (error) {
    console.error("Error:", error);
  }
}

run();
