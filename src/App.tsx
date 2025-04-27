import './App.css'
import './reset.css'
import './ui/fonts/gameovercre.css'
import './ui/buttons/primary.css'
import Game from "./components/game/Game.tsx";
import EscapeMenu from "./components/game/EscapeMenu/EscapeMenu.tsx";

function App() {

    return (
        <>
            <EscapeMenu/>
            <Game></Game>
        </>
    )
}

export default App
