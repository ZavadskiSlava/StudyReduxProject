import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import { heroesFetchingError, heroesAdd } from "../heroesList/heroesSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAll } from "../heroesFilters/filtersSlice";
import store from "../../store";

const HeroesAddForm = () => {
  const [newHeroName, setNewHeroName] = useState("");
  const [newHeroDescription, setNewHeroDescription] = useState("");
  const [newHeroElement, setNewHeroElement] = useState("");
  const { request } = useHttp();
  const dispatch = useDispatch();
  const { filtersLoadingStatus } = useSelector((state) => state.filters);
  const filters = selectAll(store.getState());

  const onSubmithHero = (e) => {
    e.preventDefault();

    const newHero = {
      id: uuidv4(),
      name: newHeroName,
      description: newHeroDescription,
      element: newHeroElement,
    };

    request(`http://localhost:3001/heroes/`, "POST", JSON.stringify(newHero))
      .then(dispatch(heroesAdd(newHero)))
      .catch(() => dispatch(heroesFetchingError()));

    setNewHeroName("");
    setNewHeroDescription("");
    setNewHeroElement("");
  };

  const renderFilters = (filters, status) => {
    if (status === "loading") {
      return <option>Загрузка элементов</option>;
    } else if (status === "error") {
      return <option>Ошибка загрузки</option>;
    }

    if (filters && filters.length > 0) {
      return filters.map(({ name, label }) => {
        // eslint-disable-next-line
        if (name === "all") return;

        return (
          <option key={name} value={name}>
            {label}
          </option>
        );
      });
    }
  };

  return (
    <form className="border p-4 shadow-lg rounded" onSubmit={onSubmithHero}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">
          Имя нового героя
        </label>
        <input
          required
          type="text"
          name="name"
          className="form-control"
          id="name"
          placeholder="Как меня зовут?"
          value={newHeroName}
          onChange={(e) => setNewHeroName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">
          Описание
        </label>
        <textarea
          required
          name="text"
          className="form-control"
          id="text"
          placeholder="Что я умею?"
          style={{ height: "130px" }}
          value={newHeroDescription}
          onChange={(e) => setNewHeroDescription(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="element" className="form-label">
          Выбрать элемент героя
        </label>
        <select
          required
          className="form-select"
          id="element"
          name="element"
          value={newHeroElement}
          onChange={(e) => setNewHeroElement(e.target.value)}
        >
          <option>Я владею элементом...</option>

          {renderFilters(filters, filtersLoadingStatus)}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Создать
      </button>
    </form>
  );
};

export default HeroesAddForm;
