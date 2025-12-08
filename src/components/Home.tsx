import './Home.css';
import background from '../assets/background.png';
import buttonBackground from '../assets/modal_background.png';

interface HomeProps {
    onCreateTree: () => void;
}

export function Home({ onCreateTree }: HomeProps) {
    return (
        <div className="home-container">
            {/* Background */}
            <img
                src={background}
                alt=""
                className="home-background"
            />

            {/* Create Tree Button */}
            <button className="create-tree-button" onClick={onCreateTree}>
                <img
                    src={buttonBackground}
                    alt=""
                    className="button-background"
                />
                <span className="button-text">내 트리 생성하기</span>
            </button>
        </div>
    );
}
