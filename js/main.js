(() => {
  let yOffset = 0; // window.pageYoOffset 대신 쓸 변수(스크롤 된 숫자 화면에 안보이는것 포함)
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; //현재 활성화된 씬
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true

  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
        canvas: document.querySelector("#video-convas-0"),
        context: document.querySelector("#video-convas-0").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImageCount: 300,
        imageSequence: [0, 299],
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
        messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
        messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
        messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
      },
    },
    {
      // 1
      type: "normal",
      // heightNum: 5, // type normal에서는 필요 없음
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      // 2
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
        messageA: document.querySelector("#scroll-section-2 .a"),
        messageB: document.querySelector("#scroll-section-2 .b"),
        messageC: document.querySelector("#scroll-section-2 .c"),
        pinB: document.querySelector("#scroll-section-2 .b .pin"),
        pinC: document.querySelector("#scroll-section-2 .c .pin"),
      },
      values: {
        messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
        messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
        messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
        messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
        messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
        messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
        messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
        messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
        messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
        messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
        messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
        messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
        pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
        pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }],
      },
    },
    {
      // 3
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
        canvasCaption: document.querySelector(".canvas-caption"),
      },
      values: {},
    },
  ];

  function calcValues(values, currentYOffset) {
    let rv;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;
    if (values.length === 3) {
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;
      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }
    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        let sequence = Math.round(
          calcValues(values.imageSequence, currentYOffset)
        );
        objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        if (scrollRatio <= 0.22) {
          // in
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_in,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_out,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.42) {
          // in
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_in,
            currentYOffset
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_out,
            currentYOffset
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.62) {
          // in
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_in,
            currentYOffset
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_out,
            currentYOffset
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.82) {
          // in
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_in,
            currentYOffset
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageD_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_out,
            currentYOffset
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageD_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        break;

      case 2:
        // console.log('2 play');
        if (scrollRatio <= 0.32) {
          // in
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_in,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_out,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.67) {
          // in
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_in,
            currentYOffset
          )}%, 0)`;
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_in,
            currentYOffset
          );
          objs.pinB.style.transform = `scaleY(${calcValues(
            values.pinB_scaleY,
            currentYOffset
          )})`;
        } else {
          // out
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_out,
            currentYOffset
          )}%, 0)`;
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_out,
            currentYOffset
          );
          objs.pinB.style.transform = `scaleY(${calcValues(
            values.pinB_scaleY,
            currentYOffset
          )})`;
        }

        if (scrollRatio <= 0.93) {
          // in
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_in,
            currentYOffset
          )}%, 0)`;
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_in,
            currentYOffset
          );
          objs.pinC.style.transform = `scaleY(${calcValues(
            values.pinC_scaleY,
            currentYOffset
          )})`;
        } else {
          // out
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_out,
            currentYOffset
          )}%, 0)`;
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_out,
            currentYOffset
          );
          objs.pinC.style.transform = `scaleY(${calcValues(
            values.pinC_scaleY,
            currentYOffset
          )})`;
        }

        break;

      case 3:
        // console.log('3 play');
        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      //이전 스크롤 섹션들의 높이와 현재 활성화된 씬 자기 자신의 높이의 합이 스크롤 된 높이보다 작아지면
      //활성화된 씬을 다읍으로 넘긴다.
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }
    if (yOffset < prevScrollHeight) {
      // 현재 스크롤된 높이가 이전 스크롤 섹션들의 높이의 합보다 작아지면
      // 활성화 된 씬을 이전으로 넘긴다.
      if (currentScene === 0) return; //브라우져 바운스 효과로 인해 마이너스가 되는것 방지
      enterNewScene = true;

      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }
    if (enterNewScene) return;
    playAnimation();
  }

  function setCanvasImage() {
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem = new Image();
      imgElem.src = `../001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }
  }

  setCanvasImage();

  function setLayout() {
    //각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);

    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
  }

  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });
  window.addEventListener("resize", setLayout);
  window.addEventListener("load", setLayout);
})();
