import { useNavigate } from "react-router-dom";
import "../../../styles/Tournament.css";
const TournamentSection = () => {
  const navigate = useNavigate();
  return (
    <div className="containers">
      <p id="tour">Турнирная сетка:</p>
      <div className="tourBlock">
        <div className="tourBracket_block">
          <p>
            Участвуя в турнире колледжа, открывается уникальная возможность
            получить разнообразные подарки. От сертификатов на покупки в местных
            магазинах до эксклюзивных призов от спонсоров мероприятия. Возможно,
            вы выиграете годовой доступ к спортивному залу или бесплатный ужин в
            лучших ресторанах города. Помимо материальных выгод, такое участие
            дает шанс на расширение социальных связей и повышение рейтинга в
            колледже. Подарки могут быть как полезными, так и развлекательными,
            подходящими для студентов с любыми интересами и потребностями.
            Участвуйте и получайте приятные сюрпризы, становясь частью активной
            студенческой жизни!
          </p>
          <textarea placeholder='console.log("Hello world!")' />
          <button onClick={() => navigate("/playground")}>Учавствовать</button>
        </div>
        <div>
          <iframe
            src="https://brackethq.com/b/y4x7b/embed/"
            width="100%"
            height="1000"
            frameborder="0"
            className="tourBlock_bracket"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TournamentSection;
