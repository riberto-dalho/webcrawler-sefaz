const puppeteer = require("puppeteer");

const url =
  "https://satsp.fazenda.sp.gov.br/COMSAT/Public/ConsultaPublica/ConsultaPublicaCfe.aspx";

const sleep = function (ms) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, ms);
  });
};

let extFunc = {
    sleep: sleep.toString(),
  };

async function openPage() {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: false,
    devtools: true, 
    // slowMo: 10
  });

  const page = await browser.newPage();

  try {
    await page.goto(url);
  } catch (err) {
    console.log(err);
  }

  // dar tempo de carregar a página para poder clicar no botão de prosseguir
  await sleep(2000);

  //   await page.$eval("proceed-link", )

  await page.evaluate(async (externalFunc) => {
    // exemplo de como passar uma função
    const funStr = externalFunc.sleep;
    const sleep = new Function(`return ${funStr}.apply(null, arguments)`);

    let btnProceedErrorSSL = document.getElementById("proceed-link");
    btnProceedErrorSSL.click();
  }, extFunc);

  return page;

  //await browser.close();
}

async function breakCaptcha(page) {
  await sleep(2000);

//   let pagehtml = await page.evaluate(() => {
//     let elements = document.getElementsByTagName("iframe");

//     console.log(elements);
//     if (elements && elements.length > 0){
//         let iframe = elements[0];
//         return iframe.contentDocument;
//     }
//     // return document.documentElement.innerHTML;
//   })

  let captchaPos = await page.evaluate(() => {
    debugger;

    let tentativas = 0;

    //   let elemRecaptcha = document.getElementsByClassName(
    //     "recaptcha-checkbox-border"
    //   );
        let elemRecaptcha = document.getElementsByTagName("iframe");

      console.log(elemRecaptcha);
      if (elemRecaptcha && elemRecaptcha.length > 0) {
        console.log("Achou");

        let boxRecaptcha = elemRecaptcha[0].getBoundingClientRect();

        console.log(boxRecaptcha);

        // let posX = boxRecaptcha.x + boxRecaptcha.height / 2;
        // let posY = boxRecaptcha.y + boxRecaptcha.width / 2;

        let posX = boxRecaptcha.x + 78 / 2;
        let posY = boxRecaptcha.y + 5;

        console.log(`posX; ${posX}, posY: ${posY}`);

        return {posX, posY};
      }

      tentativas++;
      console.log(`tentativa: ${tentativas}`);

      if (tentativas > 10) {
        console.log("Não achou");
      }
  });

  await page.mouse.click(captchaPos.posX, captchaPos.posY);
}

async function start(){

    let page1 = await openPage();
    await breakCaptcha(page1);

    // await breakCaptcha(page1);

    // await breakCaptcha(page1);
}

start();