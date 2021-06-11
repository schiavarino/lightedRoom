module.exports = { 
    handle: function(data) {
        const roomWithWalls = extractCoord(data);
        console.dir(roomWithWalls)
        return 1; //smartLight(roomWithWalls);
    }
};

function smartLight(data) {
    let result = [...data];
    let finished = false;
    while (!finished) {
        ///prueba///
        result = result.reverse(); 
        ////prueba///
        let dark = searchFirstDark(result);
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
}

function extractCoord(data) {

    console.dir(data)

    return data.map((row) => {
        return row.map((column) => {
            return {
                isWall: column.value,
                isLight: false,
                iluminated: false,
            };
        });
    });
}

function putLights(data, dark) {
    console.dir(dark)
    let withLights = [...data];
    for (var i = 0; i < withLights.length; i++) {
        if (
            dark.row == withLights[i].row &&
            dark.column == withLights[i].column &&
            !withLights[i].isWall
        ) {
            withLights[i].isLight = true;
            break;
        }
    }

    return withLights;
};

function getRowOfLight(data, item) {
    let row = data.filter((square) => {
        return square.row == item.row;
    });

    return row;
};

function getColumnOfLight(data, item) {
    let column = data.filter((square) => {
        return square.column == item.column;
    });

    return column;
};

//show the room with courrent ilumination //

function turnOnLights(data) {
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
            let i2 = item.column; //porq no usar el mismo item.column??

            while (i2 >= 0 && !row[i2].isWall) {
                //console.log("uno iluminado a la izquierda");
                row[i2].iluminated = true;
                i2 = i2 - 1; //i2--
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

function isFullyIluminated(data) {
    let result = true;
    data.map((square) => {
        if (!square.iluminated && !square.isWall) {
            result = false;
        }
    });
    //console.log("room fully lighted: " + result);
    return result;
};

function searchFirstDark(data) {
    let dark = {};

    for (var i = 0; i < data.length; i++) {
        if (!data[i].iluminated && !data[i].isWall && !dark.row) { //porq el !dark.row?
            dark = data[i];
            console.log("el primer oscuro es: " + data[i].row + data[i].column);
            break;
        }
        console.log("itera: " + data[i].row + data[i].column)
    }

    return dark;
};