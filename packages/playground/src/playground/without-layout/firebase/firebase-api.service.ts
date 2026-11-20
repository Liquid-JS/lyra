import { inject, Service } from '@angular/core'
import { Database, objectVal, ref } from '@angular/fire/database'

@Service({ autoProvided: false })
export class FirebaseAPIService {
    private readonly db = inject(Database)

    getGreeting() {
        return objectVal(ref(this.db, '/greeting/'))
    }
}
