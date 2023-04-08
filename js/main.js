document.querySelectorAll("input[id^=input]").forEach(val => {
  val.addEventListener("input", e => {
    draw();
  });
});

document.getElementById("input-rank").addEventListener("change", e => {
  draw();
});

document.getElementById("input-message").addEventListener("input", e => {
  draw();
});

const largeFontSize = 100;
const mediumFontSize = 58;
const smallFontSize = 48;
let layers = [];
let character = null;
let boldFont, normalFont;

function preload() {
  layers[0] = loadImage("./image/0.png");
  layers[1] = loadImage("./image/1.png");
  layers[2] = loadImage("./image/2.png");
  boldFont = loadFont("./font/GenEiNuGothic-EB.ttf");
  normalFont = loadFont("./font/SourceHanSansJP-Normal.otf");
}

function setup() {
  let canvas = createCanvas(1920, 1080);
  canvas.parent("canvas");
  noLoop();

  makeInputFile("input-image", "image/*", file => {
    if (file.type === 'image') {
      character = loadImage(file.data, () => {
        draw();
      });
    } else {
      character = null;
    }
  });

  makeInputFile("input-bold-font", ".ttf,.otf", file => {
    loadFont(file.data, f => {
      boldFont = f;
      draw();
    });
  });

  makeInputFile("input-normal-font", ".ttf,.otf", file => {
    loadFont(file.data, f => {
      normalFont = f;
      draw();
    });
  });
}

function makeInputFile(parent = "", accept = "", callback) {
  let input = createFileInput(callback);
  input.parent(parent);
  input.elt.className = "block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none";
  input.elt.setAttribute("accept", accept);
}

function draw() {
  {
    // 画像
    image(layers[0], 0, 0, width, height);
    image(layers[1], 0, 0, width, height);

    let mask = createGraphics(width, height);
    mask.background(document.getElementById("input-color").value);
    (masked = mask.get()).mask(layers[2]);
    image(masked, 0, 0, width, height);
    mask.remove();
  }

  {
    // 名前
    textFont(boldFont);
    let size = largeFontSize;
    textAlign(LEFT, TOP);
    let name = document.getElementById("input-name").value;

    while (true) {
      textSize(size);
      let tW = textWidth(name); // 820
      if (tW > 840) {
        size -= 1;
      } else {
        break;
      }
    }

    let x = 944;
    let y = 128;
    let bbox = boldFont.textBounds("│|", x, y);
    let offsetY = (120 - bbox.h) / 2 - (bbox.y - y);
    text(name, x, y + offsetY);
  }

  {
    // コードネーム
    textFont(normalFont);
    textSize(smallFontSize);
    textAlign(RIGHT, TOP);
    let aka = document.getElementById("input-aka").value;
    let x = 1778;
    let y = 249;
    let bbox = normalFont.textBounds(aka, x, y);
    let offsetY = (71 - bbox.h) / 2 - (bbox.y - y);
    text(aka, x, y + offsetY);
  }

  {
    // 台詞
    textFont(normalFont);
    textSize(smallFontSize);
    textAlign(LEFT, TOP);
    let dialogue = document.getElementById("input-dialogue").value;
    let x = 944;
    let y = 57;
    let bbox = normalFont.textBounds(dialogue, x, y);
    let offsetX = (bbox.x - x);
    let offsetY = (71 - bbox.h) / 2 - (bbox.y - y);
    text(dialogue, x - offsetX, y + offsetY);
  }

  {
    // ステータス
    textFont(normalFont);
    textAlign(LEFT, CENTER);
    let x = 944;
    let y = 342;
    let lineHeight = 82;
    textSize(smallFontSize);
    let bbox = normalFont.textBounds("①", x, y);
    let offsetY = (306 - lineHeight * 3 - bbox.h) / 2 - (bbox.y - y);
    y += offsetY;

    for (let i = 1; i <= 4; i++) {
      textSize(smallFontSize);
      let status = document.getElementById(`input-status-${i}`).value;
      let bbox = normalFont.textBounds("①", x, y);
      text(status, x, y);
      let mark = document.getElementById(`input-mark-${i}`).value;

      let val = document.getElementById(`input-rate-${i}`);
      let current = parseInt(val.value);
      let max = parseInt(val.max);
      let min = parseInt(val.min);
      let rate = constrain(current, min, max);

      let mx = x + textWidth("　　　");
      textSize(mediumFontSize);
      let markWidth = textWidth(mark);
      mx += (1426 - mx - markWidth * 5) / 2;
      let bb = normalFont.textBounds(mark);
      for (let j = 0; j < 5; j++) {
        if (j >= rate) {
          fill(200);
        }
        text(mark, mx, bbox.y - bb.y + (bbox.h - bb.h) / 2);
        mx += markWidth;
      }
      fill(0);
      y += lineHeight;
    }
  }

  {
    // ランク
    let rank = document.getElementById("input-rank").value;
    let suffix = "ランク";
    if (document.getElementById("input-plus-rank").checked) {
      suffix += "+";
    }

    fill(255);
    let x = 1426;
    let y = 517;

    // 準備
    textFont(boldFont);
    textSize(largeFontSize);
    let rankWidth = textWidth(rank);

    textFont(normalFont);
    textSize(mediumFontSize);
    let suffixWidth = textWidth(suffix);
    x += (394 - (rankWidth + suffixWidth)) / 2;

    // 描画
    textAlign(LEFT, TOP);
    textFont(boldFont);
    textSize(largeFontSize);
    let bbox = boldFont.textBounds(rank, x, y);
    let offsetY = (126 - bbox.h) / 2 - (bbox.y - y);
    text(rank, x, y + offsetY);

    textFont(normalFont);
    textSize(mediumFontSize);
    let bb = normalFont.textBounds(suffix, x + rankWidth, 0);
    text(suffix, x + rankWidth, offsetY + bbox.y - bb.y + bbox.h - bb.h);

    fill(0);
  }

  {
    // 説明文
    textFont(normalFont);
    textSize(smallFontSize);
    let lineHeight = smallFontSize * 1.2;
    textLeading(lineHeight);
    textAlign(LEFT, TOP);
    textWrap(CHAR);
    let message = document.getElementById("input-message").value;
    const x = 872;
    let y = 714 + (324 - (lineHeight * 4) + lineHeight - smallFontSize) / 2;
    let bbox = normalFont.textBounds("│|", x, y);
    y -= bbox.y - y;
    const lineWidth = 1778 - x;
    let lineCount = 0;
    message.split("\n").forEach(line => {
      const lineBbox = normalFont.textBounds(line);
      let wrapCount = Math.ceil(lineBbox.w / lineWidth) || 1;
      const overLine = lineCount + wrapCount - 4;
      if (overLine > 0) {
        wrapCount -= overLine;
      }
      text(line, x, y, lineWidth, lineHeight * wrapCount);
      y += lineHeight * wrapCount;
      lineCount += wrapCount;
    });
  }

  if (character) { // 立ち絵
    let scale = parseFloat(document.getElementById("input-scale").value);
    let w = character.width * scale;
    let h = character.height * scale;
    let x = (118 + 872) / 2 + parseInt(document.getElementById("input-x").value) - w / 2;
    let y = 540 + parseInt(document.getElementById("input-y").value) - h / 2;

    {
      // 影
      let sx = parseInt(document.getElementById("input-shadow-x").value);
      let sy = parseInt(document.getElementById("input-shadow-y").value);
      let mask = createGraphics(character.width, character.height);
      mask.background(document.getElementById("input-shadow-color").value);
      (masked = mask.get()).mask(character);
      image(masked, x + sx, y + sy, w, h);
    }

    image(character, x, y, w, h);
  }
}
