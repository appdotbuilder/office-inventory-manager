<?php

use App\Models\User;

test('user role permissions', function () {
    $user = User::factory()->user()->create();

    expect($user->canAddItems())->toBeTrue();
    expect($user->canUpdateItems())->toBeFalse();
    expect($user->canDeleteItems())->toBeFalse();
    expect($user->isAdmin())->toBeFalse();
});

test('operator role permissions', function () {
    $operator = User::factory()->operator()->create();

    expect($operator->canAddItems())->toBeTrue();
    expect($operator->canUpdateItems())->toBeTrue();
    expect($operator->canDeleteItems())->toBeFalse();
    expect($operator->isAdmin())->toBeFalse();
});

test('admin role permissions', function () {
    $admin = User::factory()->admin()->create();

    expect($admin->canAddItems())->toBeTrue();
    expect($admin->canUpdateItems())->toBeTrue();
    expect($admin->canDeleteItems())->toBeTrue();
    expect($admin->isAdmin())->toBeTrue();
});