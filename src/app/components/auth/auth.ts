import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Supabase } from '../../services/supabase';

@Component({
    selector: 'app-auth',
    imports: [ReactiveFormsModule],
    templateUrl: './auth.html',
    styleUrl: './auth.scss',
})
export class Auth implements OnInit {
    signInForm!: FormGroup;
    loading = false;
    supabase = inject(Supabase);
    fb = inject(FormBuilder);

    ngOnInit() {
        this.signInForm = this.fb.group({
            email: [''],
        });
    }

    async onSubmit(): Promise<void> {
        try {
            this.loading = true;
            const email = this.signInForm.value.email as string;
            const { error } = await this.supabase.signIn(email);
            if (error) throw error;
            alert('Check your email for the login link!');
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            this.signInForm.reset();
            this.loading = false;
        }
    }
}
