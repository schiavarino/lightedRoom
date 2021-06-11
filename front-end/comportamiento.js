let widthField = document.getElementById("matrixWidth");
let heightField = document.getElementById("matrixHeight");
let visual = document.getElementById("visual");
let maker = document.getElementById("makeMatrix");
let send = document.getElementById("send");

function createRow(width) {
    let row = [];
    for (let i = 0; i < width; i++) {
        row.push(0);
    }
    return row;
};

function createMatrix(height, width) {
    let matrix = [];
    for (let i = 0; i < height; i++) {
        let newRow = createRow(width);
        matrix.push(newRow);
    }
    return matrix;
};

function displayMatriz(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        let visualRow = document.createElement("div");
        visualRow.classList.add("newRow");
        for (let e = 0; e < matrix[i].length; e++) {
            let newElement = document.createElement("input");
            newElement.setAttribute("type", "checkbox");
            newElement.classList.add("square");
            newElement.setAttribute("id", `${i}:${e}`);
            visualRow.appendChild(newElement);
        }
        visual.appendChild(visualRow);
    }
};

function display() {
    visual.innerHTML = null;
    let width = widthField.value;
    let height = heightField.value;
    matrix = createMatrix(height, width);
    displayMatriz(matrix);
    clearMatrixValues();
};

function clearMatrixValues() {
    widthField.value = null;
    heightField.value = null;
};

function createPayload() {
    let payload = {};
    let height = visual.childElementCount;
    payload.height = height;
    let width = visual.children[0].children.length;
    payload.width = width;
    let detalle = document.getElementsByClassName("square");
    let deta = [...detalle];

    var lastRow = 0;
    let matrix = Array(height).fill(null).map(() => Array(width).fill(null));
    let matrixRow = matrix[0];
    for (var i = 0; i < deta.length; i++) {
        let item = deta[i];
        let row = item.id.charAt(0);
        let column = item.id.charAt(2);
        let info = {
            value: item.checked,
        };
        
        if(row != lastRow) {
            matrixRow = matrix[row];
        }

        matrixRow[column] = info;
        
        lastRow = row;
    }

    payload.data = matrix;

    console.dir(payload);

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

const matrixPath = "http://localhost:3001/matrix"

const submit = async () => {
    const data = createPayload();

    const payload = await JSON.stringify(data);

    fetch(matrixPath, {
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
