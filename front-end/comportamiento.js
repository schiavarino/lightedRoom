let withField = document.getElementById("matrixWidth");
let heightField = document.getElementById("matrixHeight");
let visual = document.getElementById("visual");
let maker = document.getElementById("makeMatrix");
let send = document.getElementById("send");
let matrix = [];

const makeRow = (width) => {
    let fil = [];
    for (let i = 0; i < width; i++) {
        fil.push(0);
    }
    return fil;
};

const makeMatrix = (height, width) => {
    for (let i = 0; i < height; i++) {
        let newRow = makeRow(width);
        matrix.push(newRow);
    }
    return matrix;
};

const displayMatriz = (mat) => {
    for (let i = 0; i < mat.length; i++) {
        let visualRow = document.createElement("div");
        visualRow.classList.add("newRow");
        for (let e = 0; e < mat[i].length; e++) {
            let newElem = document.createElement("input");
            newElem.setAttribute("type", "checkbox");
            newElem.classList.add("square");
            newElem.setAttribute("id", `${i}:${e}`);
            visualRow.appendChild(newElem);
        }
        visual.appendChild(visualRow);
    }
};

const display = () => {
    visual.innerHTML = null;
    let an = withField.value;
    let al = heightField.value;
    matrix = makeMatrix(al, an);
    displayMatriz(matrix);
    matrix = [];
    withField.value = null;
    heightField.value = null;
};

const makePayload = () => {
    let payload = {};
    let height = visual.childElementCount;
    payload.height = height;
    let width = visual.children[0].children.length;
    payload.width = width;
    let detalle = document.getElementsByClassName("square");
    let deta = [...detalle];
    payload.data = [];
    deta.map((square) => {
        let info = {
            coord: square.id,
            value: square.checked,
        };
        payload.data.push(info);
    });

    return payload;
};

const getRow = (data, item) => {
    let row = data.filter((square) => {
        return square.row == item.row;
    });

    return row;
};

const displaySolution = (resp) => {
    /// convertir cada array en una fila de divs ///
};

const submit = async () => {
    const data = makePayload();

    const payload = await JSON.stringify(data);

    fetch("http://localhost:3001/matrix", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },
        body: payload,
    })
        .then((resp) => {
            return resp.json();
        })
        .then((respOk) => {
            console.log(respOk);
            payloadToRows(respOk);
        })
        .catch((error) => {
            console.log(error);
        });
};

maker.addEventListener("click", display);
send.addEventListener("click", submit);
