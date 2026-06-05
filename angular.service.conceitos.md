# Angular Service — Conceitos Fundamentais

## O que é um Service?

Uma **classe** decorada com `@Injectable` que centraliza lógica reutilizável — chamadas HTTP, regras de negócio, estado compartilhado. Pertence à camada de serviços e faz o elo entre a interface do usuário e o backend.

> No Angular o Service é uma **classe**, não um módulo. Módulo tem significado específico no Angular (`NgModule`).

---

## @Injectable e providedIn

```typescript
@Injectable({
  providedIn: 'root'
})
export class TmdbService { }
```

- **`@Injectable`** — registra a classe no container do Angular para que **outros** possam injetá-la
- **`providedIn: 'root'`** — cria uma **única instância** (singleton) para toda a aplicação

```typescript
// ComponenteA injeta TmdbService
// ComponenteB injeta TmdbService
// Os dois recebem A MESMA instância — não duas cópias
```

### Analogia com Spring

| Spring | Angular |
|--------|---------|
| `@Service` / `@Component` | `@Injectable` |
| `@Autowired` | Injeção no construtor |
| Spring Container | Angular Injector |
| Singleton por padrão | `providedIn: 'root'` |
| `@PostConstruct` | `ngOnInit()` |

---

## Injeção de dependência

```typescript
export class TmdbService {
  constructor(private http: HttpClient) {}
  //          ↑ Angular injeta automaticamente
}
```

O Angular lê os tipos dos parâmetros do construtor e resolve automaticamente — você não precisa criar instâncias com `new`.

---

## Observable vs Promise

```typescript
// Promise — executa imediatamente na criação
const promise = fetch('/api/filmes'); // já foi

// Observable — lazy, só executa com .subscribe()
const obs = this.http.get('/api/filmes'); // ainda não foi
obs.subscribe(dados => console.log(dados)); // agora foi
```

| | Promise | Observable |
|--|---------|-----------|
| Emite valores | Uma vez só | Múltiplas vezes |
| Cancelável | ❌ | ✅ |
| Operadores | ❌ | ✅ map, filter, retry... |
| Lazy | ❌ | ✅ só executa com `.subscribe()` |
| Cancela ao navegar | ❌ | ✅ |

### Por que Observable no Angular?

- Cancelável — se o usuário navegar antes da resposta, cancela a requisição
- Operadores poderosos — `retry(3)`, `debounceTime`, `forkJoin`
- Economia de recursos — só busca dados quando alguém está "ouvindo"

---

## subscribe() vs await

```typescript
// await — pausa a execução e espera
const resposta = await httpCall();
console.log(resposta); // executa depois

// subscribe — registra callback, não bloqueia
httpCall().subscribe(resposta => {
  console.log(resposta); // executa quando chegar
});
console.log('executa imediatamente'); // não espera
```

---

## Ciclo de vida — ngOnInit

```
constructor()   → cria instância, injeta dependências
      ↓
ngOnInit()      → componente pronto, ideal para carregar dados
      ↓
renderização    → template exibido com os dados
```

```typescript
// ❌ construtor — Angular ainda está montando o componente
constructor(private service: TmdbService) {
  this.service.buscarFilmes().subscribe(...); // muito cedo
}

// ✅ ngOnInit — momento correto
ngOnInit() {
  this.service.buscarFilmes().subscribe(...);
}
```

> Construtor = só injeção de dependências. ngOnInit = inicialização e carregamento de dados.

---

## Service completo — exemplo real

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespostaApi } from '../models/filme';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private token = environment.tmdbToken; // token seguro via environment

  constructor(private http: HttpClient) {}

  buscarFilmesPopulares(): Observable<RespostaApi> {
    const url = `${this.apiUrl}/movie/popular?language=pt-BR`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      accept: 'application/json',
    });
    return this.http.get<RespostaApi>(url, { headers });
  }
}
```

---

## Boas práticas

- Token e configurações sensíveis sempre em `environment.ts` — nunca no código
- Service é singleton — não guarde estado que varia por componente
- Construtor só para injeção — lógica de inicialização vai no `ngOnInit()`
- Nome da classe termina com `Service` — convenção Angular