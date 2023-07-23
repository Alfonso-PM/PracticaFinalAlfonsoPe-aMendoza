using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PracticaFinalAlfonsoPeñaMendoza.Models;

namespace PracticaFinalAlfonsoPeñaMendoza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TareaController : ControllerBase
    {
        private readonly TasksContext _tasksContext;

        public TareaController(TasksContext tasksContext) 
        {
            _tasksContext = tasksContext;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista()
        {
            List<Tarea> lista = _tasksContext.Tareas.OrderByDescending(t =>t.IdTarea).ThenBy(t => t.FechaRegistro).ToList();

            return StatusCode(StatusCodes.Status200OK,lista);
        }

        [HttpPost]
        [Route("Guardar")]
        public async Task<IActionResult> Guardar([FromBody] Tarea request)
        {
                // Editar una tarea existente
                var tareaExistente = await _tasksContext.Tareas.FirstOrDefaultAsync(t => t.IdTarea == request.IdTarea);
                if (tareaExistente == null)
                {
                    await _tasksContext.Tareas.AddAsync(request);
                    await _tasksContext.SaveChangesAsync();

                    return StatusCode(StatusCodes.Status200OK, "Ok");
                }
                else
                {
                    // Actualizar las propiedades de la tarea existente
                    tareaExistente.Descripcion = request.Descripcion;
                    tareaExistente.FechaRegistro = request.FechaRegistro;

                    await _tasksContext.SaveChangesAsync();

                    return StatusCode(StatusCodes.Status200OK, "Tarea editada exitosamente.");
                }
        }


        [HttpDelete]
        [Route("Cerrar/{id:int}")]
        public async Task<IActionResult> Cerrar(int id)
        {
            Tarea tarea = _tasksContext.Tareas.Where(t => t.IdTarea == id).FirstOrDefault();

            _tasksContext.Tareas.Remove(tarea);
            await _tasksContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, "ok");
        }
    }
}
