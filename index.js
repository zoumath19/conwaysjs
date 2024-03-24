function delay( ms ) {
    return new Promise( resolve => setTimeout( resolve, ms ) );
}

function delay_function( ms, func ) {
    return new Promise( resolve => setTimeout( () => {
        func();
        resolve();
    }, ms ) );
}

function random( width, height ) {
    let grid = new Array( width );

    for( let x = 0; x < width; x++ ) {
        grid[x] = new Array( height );

        for( let y = 0; y < height; y++ ) {
            grid[x][y] = Math.random() < 0.5 ? 1 : 0;
        }
    }

    return grid;
}

function create( width, height, method ) {
    switch( method ) {
        case "random":
            return random( width, height );
        default:
            throw new Error( "Unknown method" );
    }
}

function color() {
    return `rgb(${Math.floor( Math.random() * 255 )}, ${Math.floor( Math.random() * 255 )}, ${Math.floor( Math.random() * 255 )})`;
}

function draw( grid, canvas ) {
    const ctx = canvas.getContext( "2d" );

    ctx.clearRect( 0, 0, canvas.width, canvas.height );

    for( let x = 0; x < grid.length; x++ ) {
        for( let y = 0; y < grid[x].length; y++ ) {
            if( grid[x][y] === 1 ) {
                ctx.fillStyle = color();
                ctx.fillRect( x * 10, y * 10, 10, 10 );
            }
        }
    }
}

function next( grid, canvas ) {
    let newGrid = new Array( grid.length );

    for( let x = 0; x < grid.length; x++ ) {
        newGrid[x] = new Array( grid[x].length );

        for( let y = 0; y < grid[x].length; y++ ) {
            let neighbors = 0;

            for( let dx = -1; dx <= 1; dx++ ) {
                for( let dy = -1; dy <= 1; dy++ ) {
                    if( dx === 0 && dy === 0 ) {
                        continue;
                    }

                    let nx = x + dx;
                    let ny = y + dy;

                    if( nx < 0 || nx >= grid.length || ny < 0 || ny >= grid[x].length ) {
                        continue;
                    }

                    if( grid[nx][ny] === 1 ) {
                        neighbors++;
                    }
                }
            }

            if( grid[x][y] === 1 ) {
                newGrid[x][y] = neighbors === 2 || neighbors === 3 ? 1 : 0;
            } else {
                newGrid[x][y] = neighbors === 3 ? 1 : 0;
            }
        }
    }

    return newGrid;
}

const TICK_RATE = 10;

async function main() {
    console.log( "Start of main()" );

    let grid = create( 800, 800, "random" );
    const canvas = document.getElementById( "game" );
    let running = true;
    let runtime = 0;
    let runtime_display = document.getElementById( "runtime" );

    // Game loop
    while( running ) {

        draw( grid, canvas );
        grid = next( grid, canvas );

        // This will simulate tick rate, computers are fast but maybe too fast
        // We need to artifically slow down the loop
        await delay( TICK_RATE );

        runtime += TICK_RATE;
        runtime_display.innerText = runtime;
        
        if( runtime >= 10000 ) {
            running = false;
        }
    }

    console.log( "End of main()" );
}

main().catch( console.error );
