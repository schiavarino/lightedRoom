const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

//This allow requests from the frontend
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // update to match the domain you will make the request from
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const extractCoord = (data) => {
    let extracted = [];
    data.map((item) => {
        let row = item.coord.charAt(0);
        let column = item.coord.charAt(2);
        let value = item.value;
        let newItem = {
            row: row,
            column: column,
            isWall: value,
            isLight: false,
            iluminated: false,
        };
        extracted.push(newItem);
    });
    return extracted;
};

//put ligths (not allowed on walls) - lights is an Array of objects like this one: {row:0, column: 2} //

const putLights = (data, lights) => {
    let withLights = [...data];
    lights.map((light) => {
        withLights.map((square) => {
            if (
                light.row == square.row &&
                light.column == square.column &&
                !square.isWall
            ) {
                square.isLight = true;
            }
        });
    });

    return withLights;
};

const getRowOfLight = (data, item) => {
    let row = data.filter((square) => {
        return square.row == item.row;
    });

    return row;
};

const getColumnOfLight = (data, item) => {
    let column = data.filter((square) => {
        return square.column == item.column;
    });

    return column;
};

//show the room with courrent ilumination //

const turnOnLights = (data) => {
    let lightedRoom = [...data];
    lightedRoom.map((item) => {
        if (item.isLight) {
            //TRAER LA ROW EN LA QUE ESTÁ LA LUZ Y ENCONTRAR SU POSICIÓN EN ELLA ///
            let row = getRowOfLight(lightedRoom, item);
            let i = item.column;

            //ENCENDER LA LUZ HACIA LA DERECHA HASTA ENCONTRAR PARED O QUE SE TERMINE LA ROW///

            while (i < row.length && !row[i].isWall) {
                //console.log("uno iluminado a la derecha");
                row[i].iluminated = true;
                i++;
            }

            //VOLVER A ENCONTRAR LA POSICIÓN Y ENCENDER LA LUZ HACIA LA IZQUIERDA HASTA ENCONTRAR PARED O QUE SE TERMINE LA ROW///
            let i2 = item.column;

            while (i2 >= 0 && !row[i2].isWall) {
                //console.log("uno iluminado a la izquierda");
                row[i2].iluminated = true;
                i2 = i2 - 1;
            }
            //ACTUALIZAR EL VALOR DE LIGTED EN CADA CELDA EN MATRIZ//
            row.map((elem) => {
                lightedRoom.map((square) => {
                    if (
                        square.row == elem.row &&
                        square.column == elem.column
                    ) {
                        //console.log("una celda cargada en matrix!");
                        square.iluminated = elem.iluminated;
                    }
                });
            });

            //TRAER LA COLUMNA EN LA QUE ESTÁ LA LUZ Y SU POSICIÓN EN ELLA  //
            let column = getColumnOfLight(lightedRoom, item);
            let i3 = item.row;

            //ENCENDER LA LUZ HACIA LA ABAJO HASTA ENCONTRAR PARED O QUE SE TERMINE LA COLUMN///
            while (i3 < column.length && !column[i3].isWall) {
                //console.log("uno iluminado abajo");
                column[i3].iluminated = true;
                i3++;
            }

            //VOLVER A ENCONTRAR LA POSICIÓN Y ENCENDER LA LUZ HACIA LA IZQUIERDA HASTA ENCONTRAR PARED O QUE SE TERMINE LA ROW///
            let i4 = item.row;

            while (i4 >= 0 && !column[i4].isWall) {
                //console.log("uno iluminado arriba");
                column[i4].iluminated = true;
                i4 = i4 - 1;
            }

            //ACTUALIZAR EL VALOR DE LIGTED EN CADA CELDA EN MATRIZ//
            column.map((elem) => {
                lightedRoom.map((square) => {
                    if (
                        square.row == elem.row &&
                        square.column == elem.column
                    ) {
                        //console.log("una celda cargada en matrix!");
                        square.iluminated = elem.iluminated;
                    }
                });
            });
        }
    });
    //console.log(lightedRoom);
    return lightedRoom;
};

const isFullyIluminated = (data) => {
    let result = true;
    data.map((square) => {
        if (!square.iluminated && !square.isWall) {
            result = false;
        }
    });
    //console.log("room fully lighted: " + result);
    return result;
};

const searchFirstDark = (data) => {
    let dark = {};
    data.map((square) => {
        if (!square.iluminated && !square.isWall && !dark.row) {
            dark = square;
        }
    });
    //console.log("el primer oscuro es: " + dark.row + dark.column);

    return dark;
};

const smartLight = (data) => {
    let result = [...data];
    let finished = false;
    while (!finished) {
        ///prueba///
        result = result.reverse();
        ////prueba///
        let dark = [searchFirstDark(result)];
        let roomWithBulbs = putLights(result, dark);
        let roomIluminated = turnOnLights(roomWithBulbs);
        finished = isFullyIluminated(roomIluminated);
    }
    let final = [...result];
    //console.log(final[0].row);
    if (final[0].row != 0) {
        final = final.reverse();
    }
    //console.log(final[0].row);
    return final;
};

let lightsArray = [
    //{ row: 0, column: 0 },
    //{ row: 1, column: 1 },
    //{ row: 1, column: 4 },
    // { row: 3, column: 3 },
    // { row: 4, column: 4 },
    // { row: 5, column: 5 },
    //{ row: 6, column: 6 },
    // { row: 1, column: 5 },
    // { row: 5, column: 1 },
];
//let lightItem = { row: 0, column: 0 };
app.post("/matrix", (req, res) => {
    const matriz = req.body;
    const roomWithWalls = extractCoord(matriz.data);
    //const roomWithLightsAndWalls = putLights(roomWithWalls, lightsArray);
    //const lightedRoom = turnOnLights(roomWithLightsAndWalls);
    //const fully = isFullyIluminated(lightedRoom);
    //const oscurito = searchDark(lightedRoom);

    const result = smartLight(roomWithWalls);

    res.status(201);
    res.json(result);
});

app.listen(3001, () => {
    console.log("server running!");
});
