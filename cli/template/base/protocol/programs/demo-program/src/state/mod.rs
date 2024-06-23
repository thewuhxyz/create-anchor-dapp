use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub pubkey: Pubkey,
    pub authority: Pubkey,
    pub count: u64,
    pub bump: u8,
}

impl Counter {
    pub fn init(
        &mut self, 
        pubkey: Pubkey, 
        authority: Pubkey, 
        bump: u8
    ) {
        self.pubkey = pubkey;
        self.authority = authority;
        self.bump = bump;
    }

    pub fn increment_count(&mut self) {
        self.count = self.count + 1;
    }
}