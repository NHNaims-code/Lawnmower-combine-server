const AWS =  require("@aws-sdk/client-s3");

const REGION = "us-east-1";
const BUCKET_NAME = "lawnmowerbucket";

const s3Client = new AWS.S3Client({ region: REGION });

const uploadData = async (data, userId, dataId, isMap) => {
    typeof data === "object" ? data = JSON.stringify(data) : data;
    const path = isMap ? "maps" : "tilesets";
    const params = {
        Bucket: BUCKET_NAME,
        Key: "content/" + userId + "/" + path + "/" + dataId + ".json",
        Body: data,
    }

    try {
        const ret = await s3Client.send(new AWS.PutObjectCommand(params));
        return ret;
    } catch (err) {
        console.log("Error", err);
        return err;
    }
}

const getData = async (userId, dataId, isMap) => {
    const path = isMap ? "maps" : "tilesets";
    const params = {
        Bucket: BUCKET_NAME,
        Key: "content/" + userId + "/" + path + "/" + dataId + ".json",
    }

    try {
        const ret = await s3Client.send(new AWS.GetObjectCommand(params));
        return await ret.Body.transformToString();
    } catch (err) {
        console.log("Error", err);
        return err;
    }
}

module.exports = {
    uploadData,
    getData
}
