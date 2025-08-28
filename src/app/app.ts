import { Component, inject, OnInit } from '@angular/core';
import { Account } from './components/account/account';
import { Auth } from './components/auth/auth';
import { Supabase } from './services/supabase';
import { Session } from '@supabase/supabase-js';

@Component({
    selector: 'app-root',
    imports: [Account, Auth],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App implements OnInit {
    readonly supabase = inject(Supabase);
    session!: Session | null;

    ngOnInit(): void {
        this.session = this.supabase.session;
        this.supabase.authChanges((_, session) => {
            this.session = session;
        });

        console.log(this.session);
    }
}
