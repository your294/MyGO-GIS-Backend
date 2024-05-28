const Koa = require("koa");
const Router = require("koa-router");
const staticServe = require("koa-static");
const bodyParser = require("koa-bodyparser");
const multer = require("koa-multer");
const fs = require("fs");
const path = require("path");
const UserController = require("./controller/user");

const app = new Koa();
const router = new Router();

// 定义一个中间件来获取/uploads目录下的所有图片文件名
async function getImageFilenames(ctx) {
  try {
    const directoryPath = path.join(__dirname, "/uploads"); // 假设uploads目录与app.js同级
    console.log(directoryPath);
    const files = await fs.promises.readdir(directoryPath);

    // 筛选出图片文件
    const imageFiles = files.filter((file) => {
      const extension = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".gif", ".bmp"].includes(extension);
    });

    ctx.body = imageFiles;
  } catch (error) {
    ctx.throw(500, `Failed to fetch image filenames + ${error}`);
  }
}

// 配置multer存储引擎
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 图片上传路由
router.post("/koa/upload", upload.single("image"), async (ctx) => {
  ctx.body = { message: "图片上传成功" };
});

router.get("/koa/images-name", getImageFilenames);
router.get("/koa/user/getAllUsers", UserController.listUsers);
router.post("/koa/user/login", UserController.UserLogin);

// 应用中间件
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
// 配置静态服务
app.use(staticServe(__dirname + "/uploads"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
