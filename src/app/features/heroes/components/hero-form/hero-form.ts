import { Component, inject, input, linkedSignal, output } from '@angular/core';
import { form, FormField, maxLength, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmModal } from '../../../../core/components/confirm-modal/confirm-modal';
import { Uppercase } from '../../../../core/directives/uppercase/uppercase';
import { Modal } from '../../../../core/modal/modal';
import { emptyHero, fromHero, HeroFields, validateHeroText } from '../../helpers/hero-fields';
import { CreateHero, Hero } from '../../models/hero.model';
import { HeroService } from '../../services/hero';

@Component({
  imports: [FormField, MatFormFieldModule, MatInputModule, MatButtonModule, Uppercase],
  selector: 'app-hero-form',
  styleUrl: './hero-form.scss',
  templateUrl: './hero-form.html',
})
export class HeroForm {
  readonly activeHero = input<Hero | null>();
  readonly heroService = inject(HeroService);
  readonly modalService = inject(Modal);
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  private readonly model = linkedSignal<Hero | null | undefined, HeroFields>({
    source: this.activeHero,
    computation: (hero) => (hero ? fromHero(hero) : emptyHero()),
  });

  readonly heroForm = form(this.model, (schemaPath) => {
    maxLength(schemaPath.name, 25);
    maxLength(schemaPath.realName, 25);
    maxLength(schemaPath.lastName, 25);
    maxLength(schemaPath.city, 25);
    validate(schemaPath.name, ({ value }) => validateHeroText(value()));
    validate(schemaPath.realName, ({ value }) => validateHeroText(value()));
    validate(schemaPath.lastName, ({ value }) => validateHeroText(value()));
    validate(schemaPath.city, ({ value }) => validateHeroText(value()));
  });

  save(event: Event): void {
    event.preventDefault();
    if (this.heroForm().invalid()) {
      return;
    }

    const raw = this.heroForm().value();
    const data: CreateHero = {
      name: raw.name.trim(),
      realName: raw.realName.trim(),
      lastName: raw.lastName.trim(),
      city: raw.city.trim(),
    };

    const hero = this.activeHero();
    if (hero) {
      if (this.hasNoChanges(hero, data)) {
        this.resetForm();
        this.saved.emit();
        return;
      }
      this.modalService.openModal(ConfirmModal, {
        data: {
          title: 'Edit hero',
          message: 'Are you sure you want to edit ' + hero.name + '?',
          onConfirm: () => this.triggerConfirmation({ ...data, id: hero.id }),
          onCancel: () => this.modalService.closeModal(),
        },
      });
      return;
    }

    this.heroService.create(data).subscribe(() => this.finishTrigger());
  }

  cancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  resetForm(): void {
    this.model.set(emptyHero());
  }

  finishTrigger(): void {
    this.resetForm();
    this.saved.emit();
  }

  private hasNoChanges(hero: Hero, data: CreateHero): boolean {
    return (
      data.name === hero.name.trim() &&
      data.realName === hero.realName.trim() &&
      data.lastName === hero.lastName.trim() &&
      data.city === hero.city.trim()
    );
  }

  triggerConfirmation(hero: Hero): void {
    this.modalService.closeModal();
    this.heroService.updateHero(hero).subscribe(() => this.finishTrigger());
  }
}
