import { Component, inject, input, OnInit } from '@angular/core';
import { Profile } from '../../models/profile';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Supabase } from '../../services/supabase';
import { Session } from '@supabase/supabase-js';
import { Avatar } from '../avatar/avatar';

@Component({
    selector: 'app-account',
    imports: [ReactiveFormsModule, Avatar],
    templateUrl: './account.html',
    styleUrl: './account.scss',
})
export class Account implements OnInit {
    session = input.required<Session>();
    loading = false;
    profile!: Profile;
    updateProfileForm!: FormGroup;
    supabase = inject(Supabase);
    fb = inject(FormBuilder);

    async ngOnInit() {
        this.updateProfileForm = this.fb.group({
            username: '',
            website: '',
            avatar_url: '',
        });

        await this.getProfile();

        const { username, website, avatar_url } = this.profile;

        this.updateProfileForm.patchValue({
            username,
            website,
            avatar_url,
        });
    }

    async getProfile() {
        try {
            this.loading = true;
            const { user } = this.session();
            const { data: profile, error, status } = await this.supabase.profile(user);
            if (error && status !== 406) {
                throw error;
            }
            if (profile) {
                this.profile = profile;
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            this.loading = false;
        }
    }

    async updateProfile(): Promise<void> {
        try {
            this.loading = true;
            const { user } = this.session();
            const username = this.updateProfileForm.value.username as string;
            const website = this.updateProfileForm.value.website as string;
            const avatar_url = this.updateProfileForm.value.avatar_url as string;
            const { error } = await this.supabase.updateProfile({
                id: user.id,
                username,
                website,
                avatar_url,
            });
            if (error) throw error;
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            this.loading = false;
        }
    }

    async signOut() {
        await this.supabase.signOut();
    }

    async updateAvatar(event: string): Promise<void> {
        this.updateProfileForm.patchValue({
            avatar_url: event,
        });
        await this.updateProfile();
    }

    get avatarUrl() {
        return this.updateProfileForm.value.avatar_url as string;
    }
}
