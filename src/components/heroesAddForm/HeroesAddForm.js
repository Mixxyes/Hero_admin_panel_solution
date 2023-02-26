import { useHttp } from '../../hooks/http.hook';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { heroCreated } from '../heroesList/heroesSlice';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться 
// Уникальный идентификатор персонажа можно сгенерировать через uiid //Ok
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST //Ok
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров // Ок

const HeroesAddForm = () => {
    const [formState, setFormState] = useState({
        name: "",
        description: "",
        element: "",
    });

    const {filters, filtersLoadingStatus} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();

    const onSubmit = (e) => {
        e.preventDefault();

        const newHero = {...formState, id: uuidv4()};

        request(`http://localhost:3001/heroes`, 'POST', JSON.stringify(newHero))
            .then(data => console.log(data, 'Отправка успешна'))
            .then(dispatch(heroCreated(newHero)))
            .catch(err => console.log(err));

        // Очищаем форму после отправки
        setFormState({
            name: "",
            description: "",
            element: "",
        });
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option> Загрузка элементов </option>
        } else if (status === "error") {
            return <option> Ошибка загрузки </option>
        }

        //Если фильтры есть, то рендерим их
        if (filters && filters.length > 0) {
            return filters.map(({name, label}) => {
                //Один из фильтров нам здесь не нужен
                if (name === 'all') return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={formState.name}
                    onChange={(e) => {setFormState({...formState, name: e.target.value})}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={formState.description}
                    onChange={(e) => {setFormState({...formState, description: e.target.value})}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={formState.element}
                    onChange={(e) => setFormState({...formState, element: e.target.value})}>
                    
                    <option value="">Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                    
                    {/* // <option value="fire">Огонь</option>
                    // <option value="water">Вода</option>
                    // <option value="wind">Ветер</option>
                    // <option value="earth">Земля</option> */}
                </select>
            </div>

            <button onClick={onSubmit} type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;