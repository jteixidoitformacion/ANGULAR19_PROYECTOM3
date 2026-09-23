import { Component, computed, signal } from '@angular/core';

type ExerciseId = 'communication' | 'services' | 'lifecycle' | 'inject' | 'tasks';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly title = 'Laboratorio Angular 19';
  readonly activeExercise = signal<ExerciseId>('communication');
  readonly counter = signal(2);
  readonly activityLog = signal<string[]>(['Componente hijo listo para emitir eventos.']);
  readonly auditLog = signal<string[]>([
    'Servicio AuditLogService creado en el inyector raiz.',
    'El estado se comparte con todos los consumidores.'
  ]);
  readonly lifecycleActive = signal(true);
  readonly lifecycleEvents = signal<string[]>([
    'ngOnInit: recursos preparados.',
    'ngAfterViewInit: vista disponible para interactuar.'
  ]);
  readonly tasks = signal<Task[]>([
    { id: 1, title: 'Configurar el entorno Angular 19', completed: true },
    { id: 2, title: 'Conectar el servicio de tareas', completed: false },
    { id: 3, title: 'Revisar los eventos del componente hijo', completed: false }
  ]);
  readonly completedTasks = computed(() => this.tasks().filter(task => task.completed).length);

  readonly exercises: { id: ExerciseId; number: string; label: string }[] = [
    { id: 'communication', number: '01', label: 'Comunicación entre componentes' },
    { id: 'services', number: '02', label: 'Servicios e inyección' },
    { id: 'lifecycle', number: '03', label: 'Ciclo de vida' },
    { id: 'inject', number: '04', label: 'Inyección moderna con inject()' },
    { id: 'tasks', number: '05', label: 'Reto: gestor de tareas' }
  ];

  selectExercise(exercise: ExerciseId): void {
    this.activeExercise.set(exercise);
  }

  incrementCounter(): void {
    this.counter.update(value => value + 1);
    this.addActivity(`Evento incremento emitido con valor ${this.counter()}.`);
  }

  resetCounter(): void {
    this.counter.set(2);
    this.addActivity('El padre ha restablecido el valor inicial a 2.');
  }

  registerAudit(): void {
    const time = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format();
    this.auditLog.update(entries => [`${time} - Accion registrada desde la interfaz.`, ...entries]);
  }

  toggleLifecycle(): void {
    this.lifecycleActive.update(active => !active);
    const message = this.lifecycleActive()
      ? 'ngOnInit: el componente ha vuelto a montarse.'
      : 'ngOnDestroy: recursos liberados correctamente.';
    this.lifecycleEvents.update(events => [message, ...events].slice(0, 4));
  }

  addTask(title: string): void {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      return;
    }

    this.tasks.update(tasks => [
      ...tasks,
      { id: Date.now(), title: cleanTitle, completed: false }
    ]);
  }

  toggleTask(id: number): void {
    this.tasks.update(tasks => tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  }

  removeTask(id: number): void {
    this.tasks.update(tasks => tasks.filter(task => task.id !== id));
  }

  private addActivity(message: string): void {
    this.activityLog.update(entries => [message, ...entries].slice(0, 3));
  }
}
