import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductRequest, ProductStatus } from '../../../models/Product';
import { Store } from '../../../models/Store';
import { ProductService } from '../../../services/product-service';
import { StoreService } from '../../../services/store-service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-product-form',
  styleUrl: './product-form.css',
  templateUrl: './product-form.html',
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private storeService = inject(StoreService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = signal<number | null>(null);
  stores = signal<Store[]>([]);
  guardando = signal(false);
  error = signal<string | null>(null);

  // Mismas reglas que ProductRequestDTO
  formulario = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    price: [
      null as number | null,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max(999999.99),
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ],
    ],
    description: ['', [Validators.required, Validators.maxLength(50)]],
    imageURL: ['', [Validators.maxLength(250)]],
    status: ['AVAILABLE' as ProductStatus, Validators.required],
    storeId: [null as number | null, Validators.required],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const storeParam = Number(this.route.snapshot.queryParamMap.get('storeId')) || null;

    this.storeService.getMyStores().subscribe({
      next: (stores) => {
        this.stores.set(stores);
        if (!idParam) {
          this.formulario.controls.storeId.setValue(storeParam ?? stores[0]?.id ?? null);
        }
      },
      error: (err) => {
        console.log(err);
        this.error.set('No se pudieron cargar tus comercios');
      },
    });

    if (idParam) {
      this.id.set(Number(idParam));
      this.productService.getProduct(this.id()!).subscribe({
        next: (p) => this.formulario.patchValue({ ...p, imageURL: p.imageURL ?? '' }),
        error: (err) => {
          console.log(err);
          this.error.set('No se pudo cargar el producto');
        },
      });
    }
  }

  mensaje(campo: string): string | null {
    const c = this.formulario.get(campo);
    if (!c?.errors || !(c.touched || c.dirty)) return null;
    const e = c.errors;
    if (e['required']) return 'El campo es requerido';
    if (e['minlength']) return `Debe tener al menos ${e['minlength'].requiredLength} caracteres`;
    if (e['maxlength']) return `Debe tener como máximo ${e['maxlength'].requiredLength} caracteres`;
    if (e['min']) return 'El precio debe ser mayor a 0';
    if (e['max']) return 'El precio no puede superar 999999,99';
    if (e['pattern']) return 'Usá hasta 2 decimales';
    return 'Valor inválido';
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set(null);

    const v = this.formulario.getRawValue();
    const body: ProductRequest = {
      name: v.name!.trim(),
      price: Number(v.price),
      description: v.description!.trim(),
      imageURL: v.imageURL?.trim() || null,
      status: v.status!,
      storeId: Number(v.storeId),
    };

    const request = this.id()
      ? this.productService.updateProduct(this.id()!, body)
      : this.productService.createProduct(body);

    request.subscribe({
      next: () =>
        this.router.navigate(['/myProducts'], { queryParams: { storeId: body.storeId } }),
      error: (err) => {
        console.log(err);
        this.guardando.set(false);
        this.error.set(
          err.status === 404
            ? 'El comercio no existe o no te pertenece'
            : 'No se pudo guardar el producto',
        );
      },
    });
  }
}