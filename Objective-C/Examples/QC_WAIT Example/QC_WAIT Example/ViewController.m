//
//  ViewController.m
//  QC_WAIT Example
//
//  Created by Lee Barney on 9/18/12.
//  Copyright (c) 2012 Lee Barney. All rights reserved.
//

#import "ViewController.h"
#import "QuickConnect.h"
#import "CheckUrlValCO.h"


@interface ViewController ()

@end

@implementation ViewController
@synthesize urlInut;
@synthesize errorDisplay;
@synthesize webDisplay;
@synthesize sadSmiley;
@synthesize happySmiley;
@synthesize theQuickConnect;

- (void)viewDidLoad
{
    [super viewDidLoad];
    theQuickConnect = [[QuickConnect alloc] init];
    
    /*
     * map the stack needed
     */
    [theQuickConnect mapCommandToValCO:@"load" withObject:[CheckUrlValCO class]];
    [theQuickConnect mapCommandToBCO:@"load" withObject:[getPageDCO class]];
    [theQuickConnect mapCommandToVCO:@"load" withObject:[showPageVCO class]];
    [theQuickConnect mapCommandToVCO:@"load" withObject:[showSmileyVCO class]];
}

- (void)viewDidUnload
{
    [self setUrlInut:nil];
    [self setErrorDisplay:nil];
    [self setWebDisplay:nil];
    [self setSadSmiley:nil];
    [self setHappySmiley:nil];
    [super viewDidUnload];
    // Release any retained subviews of the main view.
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    return YES;
}

- (IBAction)loadURLDataFromWeb:(id)sender {
    
}
@end
