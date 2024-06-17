<?php

namespace Database\Seeders;

use App\Models\Role;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Contact;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Database\Seeders\AccountSeeder;
use Database\Seeders\ChartOfAccountSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'fend@jour.com',
            'password' => 'password'
        ]);

        $this->call([
            AccountSeeder::class,
            ChartOfAccountSeeder::class
        ]);

        Warehouse::create([
            'code' => 'HQT',
            'name' => 'HEADQUARTER',
            'location' => 'Bandung, Jawa Barat, ID, 40375',
            'chart_of_account_id' => 1
        ]);

        Role::create([
            'user_id' => 1,
            'warehouse_id' => 1,
            'role' => 'Administrator'
        ]);

        Contact::create([
            'name' => 'General',
            'type' => 'Customer',
            'Description' => 'General Customer',
        ]);
    }
}
