#!/usr/bin/env python3
"""Test Supabase connection and users table"""

from services.supabase_service import SupabaseService
import os
from dotenv import load_dotenv

load_dotenv()

try:
    service = SupabaseService()
    print('✓ Supabase connection successful')
    print(f'URL: {service.supabase_url}')
    
    # Try to query users table
    response = service.client.table('users').select('*').limit(1).execute()
    print(f'✓ Users table exists')
    print(f'Users count: {len(response.data)}')
    
    if len(response.data) > 0:
        print(f'Sample user: {response.data[0]}')
        
except Exception as e:
    print(f'✗ Error: {e}')
    import traceback
    traceback.print_exc()
