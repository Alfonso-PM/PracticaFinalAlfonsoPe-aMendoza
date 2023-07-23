import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react";

const App = () => {

    const [tareas, setTareas] = useState([]);
    const [descripcion, setDescripcion] = useState("");
    const [fechaTarea, setFechaTarea] = useState('');
    const [idTarea, setIdTarea] = useState(0);
    const [tareaEditando, setTareaEditando] = useState(null);
    const mostrarTareas = async () => {

        const response = await fetch("api/tarea/Lista");
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            setTareas(data)
        } else {
            console.log("status code:" + response.status)
        }

    }

    const formatDate = (string) => {
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        let fecha = new Date(string).toLocaleDateString("es-PE", options);
        return fecha
    }

    useEffect(() => {
        mostrarTareas();
    }, [])

    const guardarTarea = async (e) => {

        e.preventDefault()

        const response = await fetch("api/tarea/Guardar", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ idTarea: idTarea, descripcion: descripcion, fechaRegistro: fechaTarea })
        })

        if (response.ok) {
            setDescripcion("");
            setFechaTarea("");
            setIdTarea(0);
            await mostrarTareas();
        }
    }

    const editarTarea = (tarea) => {
        setTareaEditando(tarea);
        setDescripcion(tarea.descripcion);
        setFechaTarea(tarea.fechaRegistro);
        setIdTarea(tarea.idTarea);
    };

    const cerrarTarea = async (id) => {

        const response = await fetch("api/tarea/Cerrar/" + id, {
            method: "DELETE"
        })

        if (response.ok)
            await mostrarTareas();
    }

    return (
        <div className="container p-4 vh-100">
            <h2 className="text-white">Lista de tareas</h2>
            <div className="row">

                <div className="col-sm-12">
                    <form onSubmit={guardarTarea}> 

                        <div className="input-group"> 
                            <input type="text" className="form-control"
                                placeholder="Ingrese descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)} />
                            <input
                                type="date"
                                className="form-control"
                                value={fechaTarea}
                                onChange={(e) => setFechaTarea(e.target.value)}
                            />
                            <input
                                type="hidden"
                                className="form-control"
                                value={idTarea}
                                onChange={(e) => setIdTarea(e.target.value)}
                            />
                            <button className="btn btn-success">Agregar</button>
                        </div>

                    </form>
                </div>

            </div>

            <div className="row mt-4">
                <div className="col-sm-12">
                    <div className="list-group">
                        {
                            tareas.map(
                                (item) => (
                                    <div key={item.idTarea} className="list-group-item list-group-item-action">

                                        <h5 className="text-primary">{item.descripcion}</h5>

                                        <div className="d-flex justify-content-between">
                                            <small className="text-muted">Fecha designada: {formatDate(item.fechaRegistro)}</small>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-success mr-2"
                                                onClick={() => editarTarea(item)}
                                            >
                                                Editar
                                            </button>
                                            <button type="button" className="btn btn-sm btn-outline-success"
                                                onClick={() => cerrarTarea(item.idTarea)}>
                                                Completada!
                                            </button>
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;